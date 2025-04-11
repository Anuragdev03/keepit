import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner } from "react-native-vision-camera"
import queryString from 'query-string';
import { useIsFocused } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

interface OtpAuthData {
    type: 'totp' | 'hotp';
    secret: string;
    issuer: string;
    account: string;
    algorithm: string;
    digits: number;
    period: number;
}


export default function ScanQR(props: any) {
    const isFocused = useIsFocused()
    const { hasPermission, requestPermission } = useCameraPermission()
    const device = useCameraDevice('back');
    const navigation = props.navigation;

    useEffect(() => {
        const getPermission = async () => {
            if (!hasPermission) {
                await requestPermission();
            }
        };
        getPermission();
    }, [hasPermission])

    const codeScanner = useCodeScanner({
        codeTypes: ['qr', 'ean-13'],
        onCodeScanned: (codes) => {
            try {
                const { value } = codes[0];
                if(value) {
                    const data = parseOtpAuthUrl(value);
                    if(data) {
                        navigation.navigate("AddNewAccount", data);
                    } else {
                        Toast.show({
                            type: "info",
                            text1: "Invalid QR code"
                        })
                    }
                }

            } catch (err) {
                console.log(err)
            }
        }
    })


    function parseOtpAuthUrl(otpUrl: string): OtpAuthData | null {
        try {
            // Split into protocol, path, and query
            const [protocol, rest] = otpUrl.split('://');
            if (protocol !== 'otpauth') throw new Error('Invalid protocol');

            const [type, fullLabel] = rest.split('/');
            if (!type || !fullLabel) throw new Error('Invalid path');

            const [queryStringPart] = fullLabel.split('?');
            const label = queryStringPart || fullLabel;
            const query = otpUrl.includes('?') ? otpUrl.split('?')[1] : '';

            // Parse query params
            const params: any = queryString.parse(query);

            // Extract issuer/account from label (e.g., "Google:user@gmail.com")
            const [labelIssuer, account] = label.includes(':')
                ? label.split(':')
                : [params.issuer, label];

            return {
                type: (type as 'totp' | 'hotp') || 'totp',
                secret: params.secret, // Will throw if missing
                issuer: params.issuer || labelIssuer,
                account: account,
                algorithm: params.algorithm || 'SHA1',
                digits: parseInt(params.digits) || 6,
                period: parseInt(params.period) || 30,
            };
        } catch (error) {
            console.error('Failed to parse otpauth URL:', error);
            return null;
        }
    }


    if (!device || !hasPermission) return null;
    return (
        <View style={{ flex: 1 }}>
            {device && hasPermission ?
                <Camera
                    style={StyleSheet.absoluteFill}
                    device={device}
                    isActive={isFocused}
                    codeScanner={codeScanner}
                />
                : null}
        </View>
    )
}
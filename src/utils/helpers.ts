
import { NativeModules } from 'react-native';
const { ClipboardModule } = NativeModules;

export async function copyToClipboard(value: string) {
    ClipboardModule.copyToClipboard(value);
}

import { NativeModules } from 'react-native';
const { ClipboardModule } = NativeModules;

export async function copyToClipboard(value: string) {
    ClipboardModule.copyToClipboard(value);
}

export const getCurrentDateTime = () => {
    const date = new Date();
  
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();
  
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    return `${day}-${month}-${year}_${hours}-${minutes}-${seconds}`;
  };
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function shiftChar(char: string, shift: number) {
  if (char >= 'a' && char <= 'z') {
    return String.fromCharCode(
      ((char.charCodeAt(0) - 'a'.charCodeAt(0) + shift) % 26) +
        'a'.charCodeAt(0)
    );
  } else if (char >= 'A' && char <= 'Z') {
    return String.fromCharCode(
      ((char.charCodeAt(0) - 'A'.charCodeAt(0) + shift) % 26) +
        'A'.charCodeAt(0)
    );
  } else {
    return char;
  }
}

// @NOTE: 암호화 함수
export function encrypt(text: string, shift = 3) {
  return text
    .split('')
    .map((char: string) => shiftChar(char, shift))
    .join('');
}

// @NOTE: 복호화 함수
export function decrypt(text: string | undefined, shift = 3) {
  if (!text) return '';

  return text
    .split('')
    .map((char: string) => shiftChar(char, -shift))
    .join('');
}

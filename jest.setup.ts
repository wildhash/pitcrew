import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Polyfill for Next.js APIs in tests
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

// Mock Request and Response for API route tests
if (typeof Request === 'undefined') {
  global.Request = class Request {} as any;
}

if (typeof Response === 'undefined') {
  global.Response = class Response {} as any;
}


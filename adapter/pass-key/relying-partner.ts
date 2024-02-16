import { baseUrl, id } from '@/app/config'
import { CredentialDeviceType } from 'node_modules/@simplewebauthn/server/esm/deps'

// Human-readable title for your website
export const rpName = 'C02data.org'
// A unique identifier for your website
export const rpID = id
// The URL at which registrations and authentications should occur
export const rpOrigin = baseUrl

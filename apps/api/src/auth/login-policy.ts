
export const LOGIN_POLICY = {
  windowMs: 10 * 60 * 1000,          
  maxAttemptsPerEmail: 10,           
  maxAttemptsPerIp: 20,              
  maxFailuresPerEmail: 5,            
  maxFailuresPerIp: 10,              
  lockMs: 15 * 60 * 1000,           
} as const;
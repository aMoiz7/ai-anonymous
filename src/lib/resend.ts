import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';


export const resend = new Resend("re_fzuiSX2W_M9NacsKco68EHXx99hMG5D2V");
console.log(process.env.NEXTAUTH_SECRET, "env")
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';

const validUsers = [
  {
    username: process.env.USER1_USERNAME,
    passwordHash: process.env.USER1_PASSWORD_HASH,
  },
  {
    username: process.env.USER2_USERNAME,
    passwordHash: process.env.USER2_PASSWORD_HASH,
  },
  {
    username: process.env.USER3_USERNAME,
    passwordHash: process.env.USER3_PASSWORD_HASH,
  }
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    const user = validUsers.find((user) => user.username === username);
    if (!user) {
      return res.status(401).json({ error: 'Username non valido' });
    }

    const isPasswordValid = await bcrypt.compare(password, user?.passwordHash || '');
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Password non valida' });
    }

    res.setHeader('Set-Cookie', `auth=true; Path=/; HttpOnly; Max-Age=3600`);
    res.status(200).json({ message: 'Login avvenuto con successo' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Metodo ${req.method} non consentito`);
  }
}

import { Request, Response } from 'express';
import { prisma } from '../db';
import { catchAsync } from '../utils/catchAsync';
import { client, line } from '../lineClient';

export const webhookServer = catchAsync(async (req: Request, res: Response) => {
  // 1. check sentFrom is in db or not
  const destination = req.body.destination;
  const user = await prisma.users.findFirst({
    where: {
      sentfrom: destination,
    },
  });
  const userExisted = user !== null;

  // 2. if not, write user to db
  const userId = req.body.events.at(0).source.userId;
  const profile = req.body.events.at(0).message.text as string;
  const [name, email, city] = profile.split(' ');
  if (!userExisted) {
    // if user not exist, create one
    await prisma.users.create({
      data: {
        name: name,
        email: email,
        city: city,
        sentfrom: destination,
        userId: userId,
      },
    });
    const replyMsg = { type: 'text', text: '成功將您的個人資料加進資料庫！' };
    client.replyMessage({
      replyToken: req.body.events.at(0).replyToken,
      messages: [replyMsg as line.TextMessage],
    });
  } else {
    console.log(
      '您提供的資訊有錯誤，請按照說明填寫您的個人資訊，才能收到我們的通知呦！',
    );
  }

  // 3. if received wanted msg, send back the adoption data

  //   console.log(users);
  // const echo = { type: 'text', text: 'hello' };
  // client.replyMessage({
  //   replyToken: req.body.events.at(0).replyToken,
  //   messages: [echo as line.TextMessage],
  // });
});

export const sendTextMsg = (req: Request, res: Response) => {
  const email = req.params.email;
  const userId = 'U94c0f0e231f60a29add12c7e5fcf1835'; // 替換為你要發送訊息的用戶ID
  const message: line.TextMessage = { type: 'text', text: 'hello' };

  client
    .pushMessage({ to: userId, messages: [message] })
    .then(() => {
      console.log('Message sent successfully');
      res.status(200).send('Message sent successfully');
    })
    .catch((err) => {
      console.error('Error sending message:', err);
      res.status(500).send('Error sending message');
    });
};

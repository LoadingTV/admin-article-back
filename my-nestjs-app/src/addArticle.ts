import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createUser(name: string, email: string, password: string) {
    try {
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password,
        },
      });
      console.log('Успех:', newUser);
    } catch (error) {
      console.error('Ошибка:', error);
    } finally {
      await prisma.$disconnect();
    }
  }

async function createArticle() {
  try {
    const newArticle = await prisma.article.create({
      data: {
        title: 'Тестик',
        keyPoints: 'Слово 1', 
        slug: 'teastik',
        created_at: new Date(),
        updated_at: new Date(),
        meta_description: 'описание',
        content: 'Содержимое статьи',

        author: {
          connect: { user_id: 1 } 
        },

        images: {
          create: [
            {
              url: 'https://example.com/image2.jpg',
              caption: 'Описание',
              alt_text: 'Alt'
            },
            {
              url: 'https://example.com/image3.jpg',
              caption: 'Описание',
              alt_text: 'Alt'
            }
          ]
        }
      },
    });

    console.log('Успех:', newArticle);
  } catch (error) {
    console.error('Ошибка:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createUser('Арина', 'arina@example.com', 'your_password');
createArticle();

  
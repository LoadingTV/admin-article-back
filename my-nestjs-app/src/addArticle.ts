import { createConnection, getConnection } from 'typeorm';
import { User } from './users/user.entity';
import { Article } from './article/article.entity';
import { Image } from './image/image.entity';

async function createUser(name: string, email: string, password: string) {
  try {
    const connection = await createConnection();
    const userRepository = connection.getRepository(User);

    const newUser = userRepository.create({
      name,
      email,
      password,
    });

    const savedUser = await userRepository.save(newUser);
    console.log('Успех:', savedUser);
  } catch (error) {
    console.error('Ошибка:', error);
  } finally {
    await getConnection().close(); // Закрываем соединение
  }
}

async function createArticle() {
  try {
    const connection = await createConnection();
    const articleRepository = connection.getRepository(Article);
    const userRepository = connection.getRepository(User);

    const author = await userRepository.findOne({ where: { user_id: 1 } });

    if (!author) {
      console.error('Автор не найден');
      return;
    }

    const newArticle = articleRepository.create({
      title: 'Тестик',
      keyPoints: 'Слово 1',
      slug: 'teastik',
      created_at: new Date(),
      updated_at: new Date(),
      meta_description: 'описание',
      content: 'Содержимое статьи',
      author,
      images: [
        {
          url: 'https://example.com/image2.jpg',
          caption: 'Описание',
          alt_text: 'Alt',
        },
        {
          url: 'https://example.com/image3.jpg',
          caption: 'Описание',
          alt_text: 'Alt',
        },
      ],
    });

    const savedArticle = await articleRepository.save(newArticle);
    console.log('Успех:', savedArticle);
  } catch (error) {
    console.error('Ошибка:', error);
  } finally {
    await getConnection().close(); // Закрываем соединение
  }
}

// Вызываем функции
createUser('Арина', 'arina@example.com', 'your_password');
createArticle();

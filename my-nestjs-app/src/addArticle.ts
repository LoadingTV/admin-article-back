import { createConnection } from 'typeorm';
import { User } from './users/user.entity';
import { Article } from './article/article.entity';

async function createUser(name: string, email: string, password: string) {
  let connection;
  try {
    connection = await createConnection();
    const userRepository = connection.getRepository(User);

    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      console.error('Пользователь с таким email уже существует.');
      return;
    }

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
    if (connection) {
      await connection.close();
    }
  }
}

async function createArticle() {
  let connection;
  try {
    connection = await createConnection();
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
      meta_description: 'описание',
      content: 'Содержимое статьи',
      author,
    });

    const savedArticle = await articleRepository.save(newArticle);
    console.log('Успех:', savedArticle);
  } catch (error) {
    console.error('Ошибка:', error);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

createUser('Арина', 'arina@example.com', 'your_password');
createArticle();

import sql from 'better-sqlite3';
import slugify from 'slugify';
import xss from 'xss';
import { processImage } from './image';

const db = sql('meals.db');

export function getMeals() {
  return db.prepare('SELECT * FROM meals').all();
}

export function getMeal(slug) {
  return db.prepare('SELECT * FROM meals WHERE slug = ?').get(slug)
}

export async function saveMeal(meal) {
  meal.slug = slugify(meal.title, { lower: true });
  meal.instructions = xss(meal.instructions);

  const timestamp = Date.now();

  const fileName = `${meal.slug}-${timestamp}.webp`;
  const bufferedImage = await meal.image.arrayBuffer();
  
  meal.blur = await processImage(bufferedImage, fileName);
  meal.image = `${fileName}`;

  db.prepare(
      `
      INSERT INTO meals
        (title, summary, instructions, creator, creator_email, image, blur, slug)
      VALUES (
        @title,
        @summary,
        @instructions,
        @creator,
        @creator_email,
        @image,
        @blur,
        @slug
      )
    `
    ).run(meal);
}
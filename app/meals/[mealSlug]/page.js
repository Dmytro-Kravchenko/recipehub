import Image from 'next/image';
import { notFound } from 'next/navigation';

import classes from './page.module.css';
import { getMeal } from '@/lib/meals';

export async function generateMetadata({ params }) {
  const meal = getMeal(params.mealSlug);

  if (!meal) {
    notFound();
  }

  return {
    title: meal.title,
    description: meal.description,
  }
}

export default async function MealDetailsPage({ params }) {
  const meal = await getMeal(params.mealSlug);

  if (!meal) {
    notFound();
  }

  meal.instructions = meal.instructions.replace(/\n/g, '<br />')

  return (
    <>
      <header className={classes.header}>
        <div className={classes.image}>
          <Image
            src={`https://recipehub-images-collection.s3.eu-north-1.amazonaws.com/${meal.image}`}
            alt={meal.title}
            fill
            placeholder='blur'
            blurDataURL={`data:image/webp;base64,${meal.blur}`}
          />
        </div>
        <div className={classes.headerText}>
          <h1>{meal.title}</h1>
          <p className={classes.creator}>
            by <a href={`mailto:${meal.creator_email}`}>{meal.creator}</a>
          </p>
          <p className={classes.summary}>{meal.summary}</p>
        </div>
      </header>
      <main>
        <p
          className={classes.instructions}
          dangerouslySetInnerHTML={{
            __html: meal.instructions,
          }}
        ></p>
      </main>
    </>
  )
}
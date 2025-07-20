'use server';

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { saveMeal } from "./meals";

function isValidText(text) {
  return !text || text.trim() === '';
}

async function verifyCaptcha(token) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;
  
  const response = await fetch(verificationURL, { method: "POST" });
  const data = await response.json();
  
  return data.success;
}

export async function shareMeal(formData) {
  const captchaToken = formData.get("captchaToken");
  
  if (!captchaToken) {
    return { message: "reCAPTCHA verification is required." };
  }
  
  const isTokenValid = await verifyCaptcha(captchaToken);

  if (!isTokenValid) {
    return { message: "reCAPTCHA verification failed." };
  }

  const meal = {
    title: formData.get('title'),
    summary: formData.get('summary'),
    instructions: formData.get('instructions'),
    image: formData.get('image'),
    creator: formData.get('name'),
    creator_email: formData.get('email')
  }

  if(
    isValidText(meal.title) ||
    isValidText(meal.summary) ||
    isValidText(meal.instructions) ||
    isValidText(meal.creator) ||
    isValidText(meal.creator_email) ||
    !meal.creator_email.includes('@') ||
    !meal.image ||
    meal.image.size === 0 ||
    !["image/png", "image/jpeg", "image/webp"].includes(meal.image.type)
  ) {
    return {
      message: 'Invalid imput.'
    }
  }
  const maxFileSize = 20 * 1024 * 1024; // 20MB

  if (meal.image.size > maxFileSize) {
    return {
      message: 'Image size is too large. Max size is 20MB.'
    }
  } 

  await saveMeal(meal);
  revalidatePath('/meals');
  redirect('/meals');
}
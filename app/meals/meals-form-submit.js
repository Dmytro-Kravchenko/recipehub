'use client';

export default function MealsFormSubmit({ isSubmitting }) {

  return <button type='submit' disabled={isSubmitting}>
    {isSubmitting ? 'Summitting...' : 'Share Meal'}
  </button>
}
'use client'

import { useEffect, useState } from 'react';
import classes from './loading.module.css';

export default function Loading() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setShow(true), 300);
    return () => clearTimeout(timeout);
  }, []);

  if (!show) return null;

  return <p className={classes.loading}>Loading...</p>  
}
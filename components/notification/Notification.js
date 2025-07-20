"use client";

import { useEffect, useState } from "react";
import classes from "./notification.module.css";

export default function Notification({ message, duration = 3000 }) {
  const [visibility, setVisibility] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisibility(false), duration);

    return () => clearTimeout(timer);
  }, [duration])

  if (!visibility) return null;

  return <p className={classes.errorNotification}>{message}</p>
}

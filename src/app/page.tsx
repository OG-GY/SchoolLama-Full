"use client";
import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import { role } from '@/lib/data';


export default function Homepage() {
  redirect(`/${role}`);
}


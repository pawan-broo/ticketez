'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { trpc } from '@/utils/trpc';
import { toast } from 'sonner';

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactPage: React.FC = () => {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const sendContact = trpc.contact.send.useMutation({
    onSuccess: () => {
      setIsSubmitting(false);
      setSubmitted(true);
    },
    onError: (err) => {
      setIsSubmitting(false);
      toast.error(err.message || 'Failed to send message. Please try again.');
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    sendContact.mutate({
      name: form.name,
      email: form.email,
      subject: form.subject,
      message: form.message,
    });
  };

  return (
    <div className='flex w-full flex-col pt-[50px] items-center justify-center border-b '>
      <div className='container flex flex-col gap-8 border-x h-full py-[80px] px-12'>
        {/* Hero */}
        <div>
          <h1 className='text-3xl font-bold'>Get in Touch</h1>
          <p className='text-muted-foreground mt-2'>
            Have questions? We&apos;d love to hear from you.
          </p>
        </div>

        {/* Two-column grid */}
        <div className='grid grid-cols-2 gap-12'>
          {/* Left — Contact Info */}
          <div className='flex flex-col gap-6'>
            {/* Email */}
            <div className='border rounded-lg p-5 flex items-start gap-4'>
              <div className='flex items-center justify-center size-10 rounded-md bg-primary/10 shrink-0'>
                <Mail className='size-5 text-primary' />
              </div>
              <div className='flex flex-col gap-0.5'>
                <p className='text-sm font-medium'>Email</p>
                <p className='text-muted-foreground text-sm'>
                  support@ticketez.com
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className='border rounded-lg p-5 flex items-start gap-4'>
              <div className='flex items-center justify-center size-10 rounded-md bg-primary/10 shrink-0'>
                <Phone className='size-5 text-primary' />
              </div>
              <div className='flex flex-col gap-0.5'>
                <p className='text-sm font-medium'>Phone</p>
                <p className='text-muted-foreground text-sm'>
                  +91 98765 43210
                </p>
              </div>
            </div>

            {/* Location */}
            <div className='border rounded-lg p-5 flex items-start gap-4'>
              <div className='flex items-center justify-center size-10 rounded-md bg-primary/10 shrink-0'>
                <MapPin className='size-5 text-primary' />
              </div>
              <div className='flex flex-col gap-0.5'>
                <p className='text-sm font-medium'>Location</p>
                <p className='text-muted-foreground text-sm'>
                  Jaipur, Rajasthan, India
                </p>
              </div>
            </div>

            {/* Hours */}
            <div className='border rounded-lg p-5 flex items-start gap-4'>
              <div className='flex items-center justify-center size-10 rounded-md bg-primary/10 shrink-0'>
                <Clock className='size-5 text-primary' />
              </div>
              <div className='flex flex-col gap-0.5'>
                <p className='text-sm font-medium'>Business Hours</p>
                <p className='text-muted-foreground text-sm'>
                  Mon–Fri, 9:00 AM – 6:00 PM IST
                </p>
              </div>
            </div>
          </div>

          {/* Right — Contact Form */}
          <div className='border rounded-lg p-8'>
            {submitted ? (
              <div className='flex flex-col items-center justify-center h-full gap-4 py-12'>
                <span className='text-4xl'>✅</span>
                <p className='text-lg font-semibold'>Message sent!</p>
                <p className='text-muted-foreground text-sm text-center'>
                  We&apos;ll get back to you soon.
                </p>
                <Button
                  variant='outline'
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: '', email: '', subject: '', message: '' });
                  }}
                >
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
                <div className='flex flex-col gap-1.5'>
                  <Label htmlFor='name'>Name</Label>
                  <Input
                    id='name'
                    name='name'
                    placeholder='Your full name'
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className='flex flex-col gap-1.5'>
                  <Label htmlFor='email'>Email</Label>
                  <Input
                    id='email'
                    name='email'
                    type='email'
                    placeholder='you@example.com'
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className='flex flex-col gap-1.5'>
                  <Label htmlFor='subject'>Subject</Label>
                  <Input
                    id='subject'
                    name='subject'
                    placeholder='How can we help?'
                    value={form.subject}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className='flex flex-col gap-1.5'>
                  <Label htmlFor='message'>Message</Label>
                  <Textarea
                    id='message'
                    name='message'
                    placeholder='Tell us more...'
                    className='min-h-[120px]'
                    value={form.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <Button type='submit' disabled={isSubmitting} className='w-full'>
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

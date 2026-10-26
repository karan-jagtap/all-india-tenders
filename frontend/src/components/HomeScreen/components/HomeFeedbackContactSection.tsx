import React, { useState } from 'react';
import {
  Paper,
  Title,
  Text,
  Badge,
  TextInput,
  Select,
  Textarea,
  Button,
  Stack,
  Group,
  SimpleGrid,
  Alert,
  ThemeIcon,
  Box,
} from '@mantine/core';
import { Mail, Send, MessageSquare, User, Phone, CheckCircle2, AlertCircle, Clock, Sparkles } from 'lucide-react';

export const HomeFeedbackContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState<string>('Feedback');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMessage('Please fill in all required fields (Name, Email, and Message).');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || null,
          subject: subject.trim(),
          message: message.trim()
        })
      });

      const data = await response.json();
      if (!response.ok) {
        let errorMsg = 'Failed to submit feedback.';
        if (typeof data.detail === 'string') {
          errorMsg = data.detail;
        } else if (Array.isArray(data.detail)) {
          errorMsg = data.detail.map((item: any) => item.msg || JSON.stringify(item)).join(', ');
        } else if (typeof data.message === 'string') {
          errorMsg = data.message;
        }
        throw new Error(errorMsg);
      }

      setSuccessMessage(data.message || 'Thank you! Your submission has been received successfully.');
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setSubject('Feedback');
    } catch (err: any) {
      console.error('Feedback submission error:', err);
      setErrorMessage(err.message || 'Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper
      id="feedback-contact-section"
      p={{ base: 'md', sm: 'xl' }}
      radius="xl"
      withBorder
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
    >
      <SimpleGrid cols={{ base: 1, lg: 12 }} spacing="xl">
        {/* Left Column: Direct Ingestion & Trust Assurances */}
        <Stack gap="lg" style={{ gridColumn: 'span 5' }}>
          <Stack gap="xs">
            <Group gap="xs">
              <Badge color="orange" variant="light" size="sm" radius="sm" leftSection={<Sparkles className="w-3.5 h-3.5" />}>
                Feedback & Contact Us
              </Badge>
            </Group>
            <Title order={2} size="h3" style={{ color: 'var(--color-text-main)', fontWeight: 800 }}>
              Get in Touch with Our Procurement Team
            </Title>
            <Text size="xs" style={{ color: 'var(--color-text-sub)', lineHeight: 1.6 }}>
              Have questions about Indian public tenders, GeM portal sourcing, or want to suggest a new platform capability? We review every submission.
            </Text>
          </Stack>

          <Stack gap="sm">
            {/* Direct Email Card */}
            <Paper
              p="md"
              radius="md"
              withBorder
              style={{
                backgroundColor: 'var(--color-surface-subtle)',
                borderColor: 'var(--color-border)',
              }}
            >
              <Group align="flex-start" gap="md">
                <ThemeIcon color="orange" variant="light" size="md" radius="md">
                  <Mail className="w-4 h-4" />
                </ThemeIcon>
                <Box style={{ flex: 1 }}>
                  <Text size="10px" fw={700} tt="uppercase" style={{ color: 'var(--color-text-dimmed)', letterSpacing: '0.05em' }}>
                    Direct Response
                  </Text>
                  <Text size="xs" fw={700} style={{ color: 'var(--color-text-main)' }}>
                    Immediate Notification
                  </Text>
                  <Text size="11px" style={{ color: 'var(--color-text-muted)' }}>
                    Automated notification sent to our team immediately upon submission.
                  </Text>
                </Box>
              </Group>
            </Paper>

            {/* Quick Response */}
            <Paper
              p="md"
              radius="md"
              withBorder
              style={{
                backgroundColor: 'var(--color-surface-subtle)',
                borderColor: 'var(--color-border)',
              }}
            >
              <Group align="flex-start" gap="md">
                <ThemeIcon color="blue" variant="light" size="md" radius="md">
                  <Clock className="w-4 h-4" />
                </ThemeIcon>
                <Box style={{ flex: 1 }}>
                  <Text size="10px" fw={700} tt="uppercase" style={{ color: 'var(--color-text-dimmed)', letterSpacing: '0.05em' }}>
                    Response SLA
                  </Text>
                  <Text size="xs" fw={700} style={{ color: 'var(--color-text-main)' }}>
                    Usually replies within 24 hours
                  </Text>
                  <Text size="11px" style={{ color: 'var(--color-text-muted)' }}>
                    Technical support for bidding documents and API integrations.
                  </Text>
                </Box>
              </Group>
            </Paper>
          </Stack>
        </Stack>

        {/* Right Column: Contact & Feedback Interactive Form */}
        <Paper
          p={{ base: 'md', sm: 'lg' }}
          radius="lg"
          withBorder
          style={{
            gridColumn: 'span 7',
            backgroundColor: 'var(--color-surface-subtle)',
            borderColor: 'var(--color-border)',
          }}
        >
          {successMessage ? (
            <Stack align="center" justify="center" py="xl" gap="md">
              <ThemeIcon color="teal" size={56} radius="xl" variant="light">
                <CheckCircle2 className="w-8 h-8" />
              </ThemeIcon>
              <Stack gap={4} align="center" style={{ maxWidth: 420, textAlign: 'center' }}>
                <Title order={3} size="h4" style={{ color: 'var(--color-text-main)', fontWeight: 700 }}>
                  Submission Successfully Received!
                </Title>
                <Text size="xs" style={{ color: 'var(--color-text-sub)' }}>
                  {successMessage}
                </Text>
                <Text size="11px" style={{ color: 'var(--color-text-dimmed)' }}>
                  Our team has been notified and will review your message shortly.
                </Text>
              </Stack>
              <Button
                variant="default"
                size="xs"
                radius="md"
                onClick={() => setSuccessMessage(null)}
              >
                Send Another Message
              </Button>
            </Stack>
          ) : (
            <form onSubmit={handleSubmit}>
              <Stack gap="sm">
                {errorMessage && (
                  <Alert
                    icon={<AlertCircle className="w-4 h-4" />}
                    color="red"
                    radius="md"
                    title="Submission Error"
                  >
                    {errorMessage}
                  </Alert>
                )}

                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
                  <TextInput
                    label="Your Full Name"
                    required
                    size="xs"
                    radius="md"
                    placeholder="e.g. Ramesh Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    leftSection={<User className="w-3.5 h-3.5 text-slate-400" />}
                  />

                  <TextInput
                    label="Email Address"
                    required
                    type="email"
                    size="xs"
                    radius="md"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    leftSection={<Mail className="w-3.5 h-3.5 text-slate-400" />}
                  />
                </SimpleGrid>

                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
                  <TextInput
                    label="Mobile / WhatsApp Number"
                    size="xs"
                    radius="md"
                    placeholder="+91 98765 43210 (optional)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    leftSection={<Phone className="w-3.5 h-3.5 text-slate-400" />}
                  />

                  <Select
                    label="Subject Category"
                    size="xs"
                    radius="md"
                    data={[
                      { value: 'Feedback', label: 'Platform Feedback' },
                      { value: 'Contact Us', label: 'Contact Us / Support' }
                    ]}
                    value={subject}
                    onChange={(val) => setSubject(val || 'Feedback')}
                  />
                </SimpleGrid>

                <Textarea
                  label={
                    <Group justify="space-between" w="100%">
                      <Group gap={4}>
                        <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                        <span>Message / Details</span>
                      </Group>
                      <Text size="10px" c="dimmed">
                        {message.length} / 5,000
                      </Text>
                    </Group>
                  }
                  required
                  size="xs"
                  radius="md"
                  minRows={4}
                  maxLength={5000}
                  placeholder={
                    subject === 'Contact Us'
                      ? 'Please describe your query, procurement requirement, or question in detail...'
                      : 'Please share your suggestions, ideas, or feedback to help us improve...'
                  }
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />

                <Group justify="flex-end" pt="xs">
                  <Button
                    type="submit"
                    color="orange"
                    radius="md"
                    size="sm"
                    loading={isSubmitting}
                    leftSection={<Send className="w-3.5 h-3.5" />}
                    styles={{ root: { fontWeight: 700 } }}
                  >
                    {subject === 'Contact Us' ? 'Submit Contact Request' : 'Submit Feedback'}
                  </Button>
                </Group>
              </Stack>
            </form>
          )}
        </Paper>
      </SimpleGrid>
    </Paper>
  );
};

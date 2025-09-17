import { z } from 'zod';
import { defineUserSignupFields } from 'wasp/auth/providers/types';

// ID de l'organisation par défaut (GEPS Demo)
const DEFAULT_ORGANIZATION_ID = '75869652-79f9-4f60-9115-e8bc55fec4be';

const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];

const emailDataSchema = z.object({
  email: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  firstNameAr: z.string().optional(),
  lastNameAr: z.string().optional(),
  gender: z.enum(['HOMME', 'FEMME', 'AUTRE']).optional(),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(), // Will be converted to DateTime
  avatar: z.string().optional(),
});

export const getEmailUserFields = defineUserSignupFields({
  email: (data) => {
    const emailData = emailDataSchema.parse(data);
    return emailData.email;
  },
  username: (data) => {
    const emailData = emailDataSchema.parse(data);
    return emailData.email;
  },
  firstName: (data) => {
    const emailData = emailDataSchema.parse(data);
    return emailData.firstName;
  },
  lastName: (data) => {
    const emailData = emailDataSchema.parse(data);
    return emailData.lastName;
  },
  firstNameAr: (data) => {
    const emailData = emailDataSchema.parse(data);
    return emailData.firstNameAr;
  },
  lastNameAr: (data) => {
    const emailData = emailDataSchema.parse(data);
    return emailData.lastNameAr;
  },
  gender: (data) => {
    const emailData = emailDataSchema.parse(data);
    return emailData.gender;
  },
  phone: (data) => {
    const emailData = emailDataSchema.parse(data);
    return emailData.phone;
  },
  dateOfBirth: (data) => {
    const emailData = emailDataSchema.parse(data);
    return emailData.dateOfBirth ? new Date(emailData.dateOfBirth) : undefined;
  },
  avatar: (data) => {
    const emailData = emailDataSchema.parse(data);
    return emailData.avatar;
  },
  isAdmin: (data) => {
    const emailData = emailDataSchema.parse(data);
    return adminEmails.includes(emailData.email);
  },
  status: (data) => {
    const emailData = emailDataSchema.parse(data);
    // Si c'est un admin, approuver automatiquement, sinon en attente
    return adminEmails.includes(emailData.email) ? 'APPROVED' : 'PENDING_APPROVAL';
  },
});

const githubDataSchema = z.object({
  profile: z.object({
    emails: z
      .array(
        z.object({
          email: z.string(),
          verified: z.boolean(),
        })
      )
      .min(1, 'You need to have an email address associated with your GitHub account to sign up.'),
    login: z.string(),
  }),
});

export const getGitHubUserFields = defineUserSignupFields({
  email: (data) => {
    const githubData = githubDataSchema.parse(data);
    return getGithubEmailInfo(githubData).email;
  },
  username: (data) => {
    const githubData = githubDataSchema.parse(data);
    return githubData.profile.login;
  },
  isAdmin: (data) => {
    const githubData = githubDataSchema.parse(data);
    const emailInfo = getGithubEmailInfo(githubData);
    if (!emailInfo.verified) {
      return false;
    }
    return adminEmails.includes(emailInfo.email);
  },
});

// We are using the first email from the list of emails returned by GitHub.
// If you want to use a different email, you can modify this function.
function getGithubEmailInfo(githubData: z.infer<typeof githubDataSchema>) {
  return githubData.profile.emails[0];
}

// NOTE: if we don't want to access users' emails, we can use scope ["user:read"]
// instead of ["user"] and access args.profile.username instead
export function getGitHubAuthConfig() {
  return {
    scopes: ['user'],
  };
}

const googleDataSchema = z.object({
  profile: z.object({
    email: z.string(),
    email_verified: z.boolean(),
  }),
});

export const getGoogleUserFields = defineUserSignupFields({
  email: (data) => {
    const googleData = googleDataSchema.parse(data);
    return googleData.profile.email;
  },
  username: (data) => {
    const googleData = googleDataSchema.parse(data);
    return googleData.profile.email;
  },
  isAdmin: (data) => {
    const googleData = googleDataSchema.parse(data);
    if (!googleData.profile.email_verified) {
      return false;
    }
    return adminEmails.includes(googleData.profile.email);
  },
});

export function getGoogleAuthConfig() {
  return {
    scopes: ['profile', 'email'], // must include at least 'profile' for Google
  };
}

const discordDataSchema = z.object({
  profile: z.object({
    username: z.string(),
    email: z.string().email().nullable(),
    verified: z.boolean().nullable(),
  }),
});

export const getDiscordUserFields = defineUserSignupFields({
  email: (data) => {
    const discordData = discordDataSchema.parse(data);
    if (!discordData.profile.email) {
      throw new Error('You need to have an email address associated with your Discord account to sign up.');
    }
    return discordData.profile.email;
  },
  username: (data) => {
    const discordData = discordDataSchema.parse(data);
    return discordData.profile.username;
  },
  isAdmin: (data) => {
    const discordData = discordDataSchema.parse(data);
    if (!discordData.profile.email || !discordData.profile.verified) {
      return false;
    }
    return adminEmails.includes(discordData.profile.email);
  },
});

export function getDiscordAuthConfig() {
  return {
    scopes: ['identify', 'email'],
  };
}

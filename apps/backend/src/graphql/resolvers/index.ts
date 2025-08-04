import { adminQueries } from './queries/admin.queries';
import { userQueries } from './queries/user.queries';
import { candidateQueries } from './queries/candidate.queries';
import { employerQueries } from './queries/employer.queries';
import { jobQueries } from './queries/job.queries';
import { applicationQueries } from './queries/application.queries';
import { resumeQueries } from './queries/resume.queries';

// Define the resolver map
export const resolvers = {
  Query: {
    // Admin resolvers
    ...adminQueries,

    // User resolvers
    ...userQueries,

    // Candidate resolvers
    ...candidateQueries,

    // Employer resolvers
    ...employerQueries,

    // Job resolvers
    ...jobQueries,

    // Application resolvers
    ...applicationQueries,

    // Resume resolvers
    ...resumeQueries,
  },

  Mutation: {
    ...require('./mutations/admin.mutations').adminMutations,
    // Add other mutations as they are implemented
  },
};

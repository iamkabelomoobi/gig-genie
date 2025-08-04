import { AdminCreateInput } from '../../../types';
import { ResolverFn } from '../../types';
import { adminRepository } from '../../../db/repositories';

export const adminMutations = {
  createAdmin: (async (_, args: AdminCreateInput) => {
    const newAdmin = await adminRepository.create(args);
    return newAdmin;
  }) as ResolverFn<AdminCreateInput>,
};

/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import { toast } from 'sonner';
import { ApiResponse } from '../types/common';

function handleApiResponse<T>(res: ApiResponse<T>, successMsg?: string): T {
  if (res.success) {
    if (successMsg) {
      toast.success(successMsg);
    }
    return (res.data as T) ?? ([] as T);
  }
  return [] as T;
}

export default handleApiResponse;

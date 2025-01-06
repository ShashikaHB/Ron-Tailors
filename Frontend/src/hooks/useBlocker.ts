/* *
 * Copyright 2024 Shark Dev (Pvt) Ltd. All rights reserved.
 *
 * Unauthorized access, copying, publishing, sharing, reuse of algorithms, concepts, design patterns
 * and code level demonstrations are strictly prohibited without any written approval of Shark Dev (Pvt) Ltd
 */
import React, { useEffect } from 'react';
import { UNSAFE_NavigationContext as NavigationContext } from 'react-router-dom';

const useCustomBlocker = (shouldBlock: boolean, message: string) => {
  const { navigator } = React.useContext(NavigationContext);

  useEffect(() => {
    if (!shouldBlock) return;

    const { push } = navigator;
    const { replace } = navigator;

    const blocker =
      (method: any) =>
      (...args: any) => {
        const confirmLeave = window.confirm(message);
        if (confirmLeave) {
          method(...args); // Proceed with navigation
        }
      };

    navigator.push = blocker(push);
    navigator.replace = blocker(replace);
  }, [shouldBlock, message, navigator]);
};

export default useCustomBlocker;

// src/utils/useBreakpoint.js
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

const useBreakpoint = () => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only('xs')); // <600px
  const isSm = useMediaQuery(theme.breakpoints.only('sm')); // 600px–899px
  const isMd = useMediaQuery(theme.breakpoints.only('md')); // 900px–1199px
  const isLg = useMediaQuery(theme.breakpoints.only('lg')); // 1200px–1535px
  const isXl = useMediaQuery(theme.breakpoints.up('xl'));   // ≥1536px

  // Return the number of columns based on the current breakpoint
  if (isXs) return 1;
  if (isSm) return 2;
  if (isMd) return 3;
  if (isLg) return 4;
  if (isXl) return 5;
  return 1; // Fallback to 1 column
};

export default useBreakpoint;
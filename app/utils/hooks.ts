import { useMediaQuery } from "@mantine/hooks";

export const useIsMobile = () => useMediaQuery('(max-width: 400px)') ?? false
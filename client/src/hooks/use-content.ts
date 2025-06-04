
import { useQuery } from "@tanstack/react-query";

interface ContentBlock {
  id: string;
  key: string;
  type: 'text' | 'image' | 'rich_text' | 'button' | 'link';
  title: string;
  value: string;
  description?: string;
  section: string;
  page: string;
  updatedAt: string;
  createdAt: string;
}

// Hook to get content by key
export const useContent = (key: string, defaultValue: string = '') => {
  const { data: content } = useQuery({
    queryKey: ["/api/content", key],
    queryFn: async () => {
      const response = await fetch(`/api/content/${key}`);
      if (!response.ok) {
        return { value: defaultValue };
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return content?.value || defaultValue;
};

// Hook to get content by page
export const usePageContent = (page: string) => {
  const { data: content = [] } = useQuery({
    queryKey: ["/api/content", page],
    queryFn: async () => {
      const response = await fetch(`/api/content?page=${page}`);
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Convert array to key-value object for easy access
  const contentMap = content.reduce((acc: Record<string, string>, block: ContentBlock) => {
    acc[block.key] = block.value;
    return acc;
  }, {});

  return {
    content: contentMap,
    blocks: content,
    getContent: (key: string, defaultValue: string = '') => contentMap[key] || defaultValue
  };
};

// Hook to get content by section
export const useSectionContent = (page: string, section: string) => {
  const { data: content = [] } = useQuery({
    queryKey: ["/api/content", page, section],
    queryFn: async () => {
      const response = await fetch(`/api/content?page=${page}&section=${section}`);
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const contentMap = content.reduce((acc: Record<string, string>, block: ContentBlock) => {
    acc[block.key] = block.value;
    return acc;
  }, {});

  return {
    content: contentMap,
    blocks: content,
    getContent: (key: string, defaultValue: string = '') => contentMap[key] || defaultValue
  };
};

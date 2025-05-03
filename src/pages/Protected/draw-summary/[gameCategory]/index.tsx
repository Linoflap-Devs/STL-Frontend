import { useRouter } from 'next/router';
import DrawSummaryPage from '..';

const DynamicDrawSummary = () => {
  const router = useRouter();
  const { gameCategory } = router.query;

  const gameCategoryMapping: Record<string, number> = {
    'stl-pares': 1,
    'stl-swer2': 2,
    'stl-swer3': 3,
    'stl-swer4': 4,
  };

  const categoryKey = Array.isArray(gameCategory) ? gameCategory[0] : gameCategory;
  const categoryId = categoryKey ? gameCategoryMapping[categoryKey] : undefined;

  return <DrawSummaryPage gameCategoryId={categoryId} />;
};

export default DynamicDrawSummary;

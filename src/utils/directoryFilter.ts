import { CategoryId, NeighborhoodId, Provider } from '../types';

export function filterProviders(
  providers: Provider[],
  category: CategoryId | 'all',
  neighborhood: NeighborhoodId,
  searchQuery: string
): Provider[] {
  return providers.filter((provider) => {
    const matchesCategory = category === 'all' || provider.categoryId === category;
    const matchesNeighborhood = neighborhood === 'all' || provider.neighborhoodId === neighborhood;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      query === '' ||
      provider.name.toLowerCase().includes(query) ||
      provider.specialty.toLowerCase().includes(query) ||
      provider.description.toLowerCase().includes(query) ||
      provider.tags.some((tag) => tag.toLowerCase().includes(query));

    return matchesCategory && matchesNeighborhood && matchesSearch;
  });
}

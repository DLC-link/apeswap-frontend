export interface ListViewProps {
  tag?: string
  title: string
  cardContent: React.ReactNode
  expandedContent: React.ReactNode
}

export interface ListCardProps extends ListViewProps {
  serviceTokenDisplay: React.ReactNode
}

export interface ExtendedListViewProps extends ListViewProps {
  tokens: { token1: string; token2: string; token3?: string; token4?: string }
}

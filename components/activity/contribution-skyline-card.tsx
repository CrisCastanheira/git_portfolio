import ContributionSkylineComponent, { type ContributionSkylineProps } from "@/components/ui/contribution-skyline";

export function ContributionSkyline(props: ContributionSkylineProps) {
  return (
    <div className="skyline-shell">
      <ContributionSkylineComponent {...props} />
    </div>
  );
}

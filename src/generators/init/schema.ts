export interface InitGeneratorSchema {
  name: string;
  provider: 'gcp' | 'aws';
  directory?: string;
  tags?: string;
  skipFormat?: boolean;
  skipPackageJson?: boolean;
  includeDocker?: boolean;
  includeMetrics?: boolean;
}

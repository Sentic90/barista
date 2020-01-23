import { Test, TestingModule } from '@nestjs/testing';

import { DefaultScanWorkerJobInfo } from '@app/default-scan/default-scan-worker/default-scan-worker-job-info.interface';
import { DefaultScanWorkerService } from '@app/default-scan/default-scan-worker/default-scan-worker.service';
import { MavenService } from '@app/default-scan/dep-clients/maven/maven.service';
import { NpmService } from '@app/default-scan/dep-clients/npm/npm.service';
import { NugetService } from '@app/default-scan/dep-clients/nuget/nuget.service';
import { DependencyCheckService } from '@app/default-scan/scanners/dependency-check/dependency-check.service';
import { LicenseCheckerService } from '@app/default-scan/scanners/license-checker/license-checker.service';
import { LicenseMavenService } from '@app/default-scan/scanners/license-maven/license-maven.service';
import { LicenseNugetService } from '@app/default-scan/scanners/license-nuget/license-nuget.service';
import { ScanCodeService } from '@app/default-scan/scanners/scan-code/scan-code.service';
import { LicenseScanResultItemService } from '@app/services/license-scan-result-item/license-scan-result-item.service';
import { LicenseService } from '@app/services/license/license.service';
import { ProjectService } from '@app/services/project/project.service';
import { ScanService } from '@app/services/scan/scan.service';
import { ServicesModule } from '@app/services/services.module';
import { AppOrmModule } from '@app/shared/app-orm.module';
import { NestApplication } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as shell from 'shelljs';
import { TestHelper } from '../shared/util/test-helper';

describe('License Nuget Service (e2e)', () => {
  let app: NestApplication;
  let licenseNugetService: LicenseNugetService;
  let job: DefaultScanWorkerJobInfo;
  let scanService;
  let projectService;
  let project;
  let scan;

  beforeEach(async (done) => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(),
        AppOrmModule,
        ServicesModule,
      ],
      providers: [
        DependencyCheckService,
        DefaultScanWorkerService,
        LicenseCheckerService,
        LicenseScanResultItemService,
        LicenseService,
        ProjectService,
        ScanService,
        ScanCodeService,
        LicenseNugetService,
        LicenseMavenService,
        MavenService,
        NpmService,
        NugetService,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    licenseNugetService = app.get(LicenseNugetService);

    scanService = app.get(ScanService);
    projectService = app.get(ProjectService);

    done();
  });

  it('Instantiates the service', () => {
    expect(licenseNugetService).toBeInstanceOf(LicenseNugetService);
  });

  describe('License tests', () => {

    beforeEach(async (done) => {
      // Create necessary scans
      project = await projectService.db.save({ name: 'test-project', gitUrl: 'http://github.com/test-project' });
      scan = await scanService.db.save({ project, deploymentType: { code: 'distributed'} });

      job = TestHelper.testJobInfo({ scanId: scan.id });

      // Copy test data to the temp directory
      shell.cp('-R', `${TestHelper.nugetSampleProject}/*`, job.tmpDir);

      done();
    });

    it('executes license nuget', async (done) => {

      jest.setTimeout(920000);
      expect(licenseNugetService).toBeInstanceOf(LicenseNugetService);

      // Execute Scan
      await licenseNugetService.execute(job);

      const actual = await scanService.db.createQueryBuilder('scan')
        .leftJoinAndSelect('scan.licenseScanResults', 'licenseScanResults')
        .leftJoinAndSelect('licenseScanResults.licenseScanResultItems', 'licenseScanResults.licenseScanResultItems')
        .whereInIds(job.scanId)
        .getOne();

      expect(actual).toBeDefined();
      expect(actual.licenseScanResults.length).toBeGreaterThan(0);

      expect(actual.licenseScanResults[0].startedAt).toBeInstanceOf(Date);
      expect(actual.licenseScanResults[0].completedAt).toBeInstanceOf(Date);
      expect(actual.licenseScanResults[0].startedAt).not.toEqual(actual.licenseScanResults[0].completedAt);

      expect(actual.licenseScanResults[0].licenseScanResultItems).toBeDefined();
      expect(actual.licenseScanResults[0].jsonResults).toBeInstanceOf(Object);
      expect(actual.licenseScanResults[0].licenseScanResultItems.length).toBeGreaterThan(0);
      expect(actual.licenseScanResults[0].licenseScanResultItems[0].path).toBeDefined();

      expect(job.errors.length).toBe(0);

      done();

    });
  });

  afterEach(async () => {
    // await projectService.db.delete({});
    return app.close();
  });
});

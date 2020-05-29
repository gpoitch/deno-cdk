#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { DenoCdkStack } from '../lib/deno-cdk-stack';

const app = new cdk.App();
new DenoCdkStack(app, 'DenoCdkStack');

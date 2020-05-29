import * as cdk from "@aws-cdk/core";
import * as apigateway from "@aws-cdk/aws-apigatewayv2";
import * as lambda from "@aws-cdk/aws-lambda";
import * as sam from "@aws-cdk/aws-sam";

export class DenoCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const deno = new sam.CfnApplication(this, "Deno", {
      location: {
        applicationId:
          "arn:aws:serverlessrepo:us-east-1:390065572566:applications/deno",
        semanticVersion: "1.0.2",
      },
    });

    const denoLayer = lambda.LayerVersion.fromLayerVersionArn(
      this,
      "DenoLayer",
      deno.getAtt("Outputs.LayerArn").toString()
    );

    const func = new lambda.Function(this, "DenoFunc", {
      layers: [denoLayer],
      runtime: lambda.Runtime.PROVIDED,
      code: lambda.Code.asset("functions"),
      handler: "index.handler",
      environment: {
        HANDLER_EXT: "js",
      },
    });

    const api = new apigateway.HttpApi(this, "DenoHttpApi", {
      defaultIntegration: new apigateway.LambdaProxyIntegration({
        handler: func,
      }),
    });
  }
}

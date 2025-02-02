/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { BuildTransactionController } from './../controllers/tx';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { HealthController } from './../controllers/health';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AgentController } from './../controllers/agent';
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';



// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "HostInfo": {
        "dataType": "refObject",
        "properties": {
            "hostname": {"dataType":"string","required":true},
            "platform": {"dataType":"string","required":true},
            "release": {"dataType":"string","required":true},
            "uptime": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"throw-on-extras","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################


    
        const argsBuildTransactionController_getTransferTransaction: Record<string, TsoaRoute.ParameterSchema> = {
                from: {"in":"query","name":"from","required":true,"dataType":"string"},
                to: {"in":"query","name":"to","required":true,"dataType":"string"},
                amount: {"in":"query","name":"amount","required":true,"dataType":"double"},
                type: {"in":"query","name":"type","dataType":"string"},
        };
        app.get('/api/build-transaction/transfer',
            ...(fetchMiddlewares<RequestHandler>(BuildTransactionController)),
            ...(fetchMiddlewares<RequestHandler>(BuildTransactionController.prototype.getTransferTransaction)),

            async function BuildTransactionController_getTransferTransaction(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsBuildTransactionController_getTransferTransaction, request, response });

                const controller = new BuildTransactionController();

              await templateService.apiHandler({
                methodName: 'getTransferTransaction',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsBuildTransactionController_getInvestTransaction: Record<string, TsoaRoute.ParameterSchema> = {
                from: {"in":"query","name":"from","required":true,"dataType":"string"},
                amount: {"in":"query","name":"amount","required":true,"dataType":"double"},
        };
        app.get('/api/build-transaction/invest',
            ...(fetchMiddlewares<RequestHandler>(BuildTransactionController)),
            ...(fetchMiddlewares<RequestHandler>(BuildTransactionController.prototype.getInvestTransaction)),

            async function BuildTransactionController_getInvestTransaction(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsBuildTransactionController_getInvestTransaction, request, response });

                const controller = new BuildTransactionController();

              await templateService.apiHandler({
                methodName: 'getInvestTransaction',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsBuildTransactionController_getSwapTransaction: Record<string, TsoaRoute.ParameterSchema> = {
                from: {"in":"query","name":"from","required":true,"dataType":"string"},
                coinInType: {"in":"query","name":"coinInType","required":true,"dataType":"string"},
                coinOutType: {"in":"query","name":"coinOutType","required":true,"dataType":"string"},
                amountIn: {"in":"query","name":"amountIn","required":true,"dataType":"double"},
                slippage: {"in":"query","name":"slippage","dataType":"double"},
        };
        app.get('/api/build-transaction/swap',
            ...(fetchMiddlewares<RequestHandler>(BuildTransactionController)),
            ...(fetchMiddlewares<RequestHandler>(BuildTransactionController.prototype.getSwapTransaction)),

            async function BuildTransactionController_getSwapTransaction(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsBuildTransactionController_getSwapTransaction, request, response });

                const controller = new BuildTransactionController();

              await templateService.apiHandler({
                methodName: 'getSwapTransaction',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsHealthController_getHealth: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/api/health',
            ...(fetchMiddlewares<RequestHandler>(HealthController)),
            ...(fetchMiddlewares<RequestHandler>(HealthController.prototype.getHealth)),

            async function HealthController_getHealth(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsHealthController_getHealth, request, response });

                const controller = new HealthController();

              await templateService.apiHandler({
                methodName: 'getHealth',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsHealthController_getHost: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/api/health/host',
            ...(fetchMiddlewares<RequestHandler>(HealthController)),
            ...(fetchMiddlewares<RequestHandler>(HealthController.prototype.getHost)),

            async function HealthController_getHost(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsHealthController_getHost, request, response });

                const controller = new HealthController();

              await templateService.apiHandler({
                methodName: 'getHost',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAgentController_handleMessage: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"dataType":"any"},
        };
        app.post('/api/agent',
            ...(fetchMiddlewares<RequestHandler>(AgentController)),
            ...(fetchMiddlewares<RequestHandler>(AgentController.prototype.handleMessage)),

            async function AgentController_handleMessage(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAgentController_handleMessage, request, response });

                const controller = new AgentController();

              await templateService.apiHandler({
                methodName: 'handleMessage',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

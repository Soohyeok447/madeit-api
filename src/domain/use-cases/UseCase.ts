import { Injectable } from "@nestjs/common";

export abstract class UseCase<Params, Response> {
  abstract execute(params: Params): Response;
}

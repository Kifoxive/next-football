export interface InitGamesBrainParams {
  id: string;
}

export default class InitGamesBrain {
  id: string;

  constructor({ id }: InitGamesBrainParams) {
    this.id = id;
  }
}

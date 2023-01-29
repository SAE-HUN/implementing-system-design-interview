export class UniqueIdGenerator {
  constructor(
    numberOfTimestampBits,
    numberOfDatacenterIdBits,
    numberOfServerIdBits,
    numberOfSerialNumberBits,
    datacenterId,
    serverId
  ) {
    this.numberOfTimestampBits = numberOfTimestampBits;
    this.numberOfDatacenterIdBits = numberOfDatacenterIdBits;
    this.numberOfServerIdBits = numberOfServerIdBits;
    this.numberOfSerialNumberBits = numberOfSerialNumberBits;

    this.datacenterId = datacenterId;
    this.serverId = serverId;
  }

  generateId(serialNumber) {
    const timestamp =
      BigInt(Math.floor(Date.now() / 1000)) <<
      BigInt(
        this.numberOfDatacenterIdBits +
          this.numberOfServerIdBits +
          this.numberOfSerialNumberBits
      );
    const datacenterId =
      BigInt(this.datacenterId) <<
      BigInt(this.numberOfServerIdBits + this.numberOfSerialNumberBits);
    const serverId =
      BigInt(this.serverId) << BigInt(this.numberOfSerialNumberBits);
    const _serialNumber = BigInt(serialNumber);

    return timestamp + datacenterId + serverId + _serialNumber;
  }

  parseId(id) {
    const timestamp =
      id >>
      BigInt(
        this.numberOfDatacenterIdBits +
          this.numberOfServerIdBits +
          this.numberOfSerialNumberBits
      );
    const datacenterId =
      (id >>
        BigInt(this.numberOfServerIdBits + this.numberOfSerialNumberBits)) -
      (timestamp << BigInt(this.numberOfDatacenterIdBits));
    const serverId =
      (id >> BigInt(this.numberOfSerialNumberBits)) -
      (timestamp <<
        BigInt(this.numberOfDatacenterIdBits + this.numberOfServerIdBits)) -
      (datacenterId << BigInt(this.numberOfServerIdBits));
    const serialNumber =
      id -
      (timestamp <<
        BigInt(
          this.numberOfDatacenterIdBits +
            this.numberOfServerIdBits +
            this.numberOfSerialNumberBits
        )) -
      (datacenterId <<
        BigInt(this.numberOfServerIdBits + this.numberOfSerialNumberBits)) -
      (serverId << BigInt(this.numberOfSerialNumberBits));

    return {
      timestamp,
      datacenterId,
      serverId,
      serialNumber,
    };
  }
}

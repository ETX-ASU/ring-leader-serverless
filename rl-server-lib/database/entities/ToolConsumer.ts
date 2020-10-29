import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("TOOL_CONSUMER")
class ToolConsumer {
  @PrimaryGeneratedColumn("uuid")
  id: number | undefined = undefined;

  @Column("varchar", { length: 128 })
  name = "";

  @Column("varchar", { length: 128 })
  iss = "";

  @Column("varchar", { length: 128 })
  client_id = "";

  @Column("varchar", { length: 128 })
  keyid = "";

  @Column("varchar", { length: 128 })
  alg = "";


  @Column({ type: "varchar", length: 128, default: "0" })
  deployment_id = "0";

  @Column("varchar", { length: 4096 })
  private_key = "";

  @Column("varchar", { length: 4096 })
  public_key = "";

  @Column("varchar", { length: 8192 })
  public_key_jwk = "";

  @Column("varchar", { length: 512 })
  platformOIDCAuthEndPoint = "";

  @Column("varchar", { length: 512 })
  platformAccessTokenEndpoint = "";
}

export default ToolConsumer;

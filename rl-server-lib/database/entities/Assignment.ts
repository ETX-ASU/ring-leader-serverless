import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("ASSIGNMENT")
class Assignment {
  @PrimaryGeneratedColumn("uuid")
  id: number | undefined = undefined;

  @Column("varchar", { length: 128 })
  type = "";

  @Column("varchar", { length: 128 })
  title = "";

  @Column("varchar", { length: 2048 })
  url = "";

  @Column("varchar", { length: 128 })
  resource_id = "";

  @Column("varchar", { length: 128 })
  lineitem_score_maximum = "";

  @Column("varchar", { length: 128 })
  lineitem_label = "";

  @Column("varchar", { length: 128 })
  lineitem_resource_id = "";

  @Column("varchar", { length: 128 })
  lineitem_tag = "";

  @Column("varchar", { length: 256 })
  lineitems = "";

  @Column("varchar", { length: 256 })
  context_id = "";
}

export default Assignment;

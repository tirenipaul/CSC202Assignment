import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('asset_entry')
export class AssetEntry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', {default: new Date().getDate()})
  acquireDay: number;

  @Column('int', {default: new Date().getMonth()})
  acquireMonth: number;

  @Column('int', {default: new Date().getFullYear()})
  acquireYear: number;

  @Column('varchar')
  description: string;

  @Column('varchar')
  value: number;

  @Column('boolean',{default: true})
  tangible: boolean
}

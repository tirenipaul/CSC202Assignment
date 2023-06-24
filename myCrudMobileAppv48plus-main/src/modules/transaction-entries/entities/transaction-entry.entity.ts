import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('transaction_entry')
export class TransactionEntry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int',{default: new Date().getDate()})
  txnDay: number;

  @Column('int',{default: new Date().getMonth()})
  txnMonth: number;

  @Column('int',{default: new Date().getFullYear()})
  txnYear: number;

  @Column('varchar')
  description: string;

  @Column('int')
  amount: number;

  @Column('boolean',{default: true})
  expense: boolean
}

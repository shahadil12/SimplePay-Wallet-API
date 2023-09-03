import { IsNumber, IsString, Length, IsNotEmpty } from "class-validator";

export class transaction {
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 4 })
  amount: number;

  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  description: string;
}

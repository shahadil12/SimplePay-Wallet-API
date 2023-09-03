import { IsInt, IsString, Length, Min, IsNotEmpty } from "class-validator";

export class wallet {
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  name: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  balance: number;
}

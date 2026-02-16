import { PartialType } from '@nestjs/swagger';
import { CreateGoDto } from './create-go.dto';

export class UpdateGoDto extends PartialType(CreateGoDto) {}

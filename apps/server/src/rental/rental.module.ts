import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RentalService } from './rental.service';
import { RentalController } from './rental.controller';
import { Vehicle } from './entities/vehicle.entity';
import { VehicleRental } from './entities/vehicle-rental.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle, VehicleRental])],
  providers: [RentalService],
  controllers: [RentalController],
})
export class RentalModule {}

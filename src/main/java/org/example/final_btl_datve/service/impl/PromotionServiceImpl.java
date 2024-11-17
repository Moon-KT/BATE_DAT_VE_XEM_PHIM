package org.example.final_btl_datve.service.impl;

import org.example.final_btl_datve.dto.PromotionDto;
import org.example.final_btl_datve.entity.Promotion;
import org.example.final_btl_datve.repository.PromotionRepository;
import org.example.final_btl_datve.service.PromotionService;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PromotionServiceImpl implements PromotionService {
    private final PromotionRepository promotionRepository;

    public PromotionServiceImpl(PromotionRepository promotionRepository) {
        this.promotionRepository = promotionRepository;
    }

    private PromotionDto convertToDto(Promotion promotion) {
        return PromotionDto.builder()
                .promotionId(promotion.getPromotionId())
                .promotionName(promotion.getPromotionName())
                .promotionDescription(promotion.getPromotionDescription())
                .promotionStartDate(promotion.getPromotionStartDate())
                .promotionEndDate(promotion.getPromotionEndDate())
                .promotionType(promotion.getPromotionType())
                .price(promotion.getPrice())
                .build();
    }

    @Override
    public PromotionDto create(PromotionDto promotionDto) throws Exception {
        Promotion promotion = Promotion.builder()
                .promotionName(promotionDto.getPromotionName())
                .promotionDescription(promotionDto.getPromotionDescription())
                .promotionStartDate(promotionDto.getPromotionStartDate())
                .promotionEndDate(promotionDto.getPromotionEndDate())
                .promotionType(promotionDto.getPromotionType())
                .price(promotionDto.getPrice())
                .build();
        return convertToDto(promotionRepository.save(promotion));
    }

    @Override
    public List<PromotionDto> reads() {
        return promotionRepository.findAll().stream().map(this::convertToDto).toList();
    }

    @Override
    public PromotionDto read(Long promotionID) throws Exception {
        return promotionRepository.findById(promotionID)
                .map(this::convertToDto)
                .orElseThrow(() -> new Exception("Promotion not found"));
    }

    @Override
    public PromotionDto update(Long promotionID, PromotionDto promotionDto) throws Exception {
        Promotion existingPromotion = promotionRepository.findById(promotionID)
                .orElseThrow(() -> new Exception("Promotion not found"));
        return convertToDto(promotionRepository.save(existingPromotion.toBuilder()
                .promotionName(promotionDto.getPromotionName())
                .promotionDescription(promotionDto.getPromotionDescription())
                .promotionStartDate(promotionDto.getPromotionStartDate())
                .promotionEndDate(promotionDto.getPromotionEndDate())
                .promotionType(promotionDto.getPromotionType())
                .price(promotionDto.getPrice())
                .build()));
    }

    @Override
    public void delete(Long promotionID) throws Exception {
        if (!promotionRepository.existsById(promotionID)) {
            throw new Exception("Promotion not found");
        }
        promotionRepository.deleteById(promotionID);
    }

    @Override
    public List<PromotionDto> findPromotionByTypes(List<String> types) {
        return promotionRepository.findPromotionByTypes(types).stream().map(this::convertToDto).toList();
    }

    @Override
    public List<PromotionDto> searchPromotion(String keyword) throws Exception {
        return promotionRepository.findPromotionsByKeyword(keyword).stream().map(this::convertToDto).toList();
    }
}

package org.example.final_btl_datve.service;

import org.example.final_btl_datve.dto.PromotionDto;
import org.example.final_btl_datve.entity.Promotion;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface PromotionService {
    //CRUD
    PromotionDto create(PromotionDto promotionDto) throws Exception;
    List<PromotionDto> reads();
    PromotionDto read(Long promotionID) throws Exception;
    PromotionDto update(Long promotionID, PromotionDto promotionDto) throws Exception;
    void delete(Long promotionID) throws Exception;

    //Other
    List<PromotionDto> findPromotionByTypes(List<String> types);
    List<PromotionDto> searchPromotion(String keyword) throws Exception;
}

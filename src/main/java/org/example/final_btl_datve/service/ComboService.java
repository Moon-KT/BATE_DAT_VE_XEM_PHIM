package org.example.final_btl_datve.service;

import org.example.final_btl_datve.dto.ComboDto;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public interface ComboService {
    //CRUD
    ComboDto create(ComboDto ComboDto) throws Exception;
    List<ComboDto> reads();
    ComboDto read(Long comboOfferID) throws Exception;
    ComboDto update(Long comboOfferID, ComboDto ComboDto) throws Exception;
    void delete(Long comboOfferID) throws Exception;

    //Other
}

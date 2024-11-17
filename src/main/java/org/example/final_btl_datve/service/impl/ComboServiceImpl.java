package org.example.final_btl_datve.service.impl;

import org.example.final_btl_datve.dto.ComboDto;
import org.example.final_btl_datve.entity.Combo;
import org.example.final_btl_datve.repository.ComboRepository;
import org.example.final_btl_datve.service.ComboService;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ComboServiceImpl implements ComboService {
    private final ComboRepository comboRepository;

    public ComboServiceImpl(ComboRepository comboRepository) {
        this.comboRepository = comboRepository;
    }

    private ComboDto convertToDto(Combo Combo) {
        return ComboDto.builder()
                .comboId(Combo.getComboId())
                .comboName(Combo.getComboName())
                .comboDescription(Combo.getComboDescription())
                .imageCombo(Combo.getImageCombo())
                .price(Combo.getPrice())
                .build();
    }

    @Override
    public ComboDto create(ComboDto ComboDto) throws Exception {
        Combo combo = Combo.builder()
                .comboName(ComboDto.getComboName())
                .comboDescription(ComboDto.getComboDescription())
                .imageCombo(ComboDto.getImageCombo())
                .price(ComboDto.getPrice())
                .build();
        return convertToDto(comboRepository.save(combo));
    }

    @Override
    public List<ComboDto> reads() {
        return comboRepository.findAll().stream().map(this::convertToDto).toList();
    }

    @Override
    public ComboDto read(Long comboID) throws Exception {
        return comboRepository.findById(comboID)
                .map(this::convertToDto)
                .orElseThrow(() -> { return new Exception("Không tìm thấy combo có ID: " + comboID);
                });
    }

    @Override
    public ComboDto update(Long comboID, ComboDto ComboDto) throws Exception {
        Combo combo = comboRepository.findById(comboID)
                .orElseThrow(() -> { return new Exception("Không tìm thấy combo có ID: " + comboID);
                });

        combo.toBuilder()
                .comboName(ComboDto.getComboName())
                .comboDescription(ComboDto.getComboDescription())
                .imageCombo(ComboDto.getImageCombo())
                .price(ComboDto.getPrice())
                .build();
        return convertToDto(comboRepository.save(combo));
    }

    @Override
    public void delete(Long comboID) throws Exception {
        if (!comboRepository.existsById(comboID)) {
            throw new Exception("Không tìm thấy combo có ID: " + comboID);
        }
        comboRepository.deleteById(comboID);
    }
}

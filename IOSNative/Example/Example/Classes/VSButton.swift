//
//  VSButton.swift
//  Example
//
//  Created by Apple on 5/19/17.
//  Copyright © 2017 viral. All rights reserved.
//

import UIKit

@IBDesignable class VSButton: UIButton {
    override init(frame: CGRect) {
        super.init(frame: frame)
    }
    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
    }
    @IBInspectable var isRightImage: Bool = false {
        didSet {
            if isRightImage {
                semanticContentAttribute = .forceRightToLeft
                contentHorizontalAlignment = .right
                let availableSpace = UIEdgeInsetsInsetRect(bounds, contentEdgeInsets)
                let availableWidth = availableSpace.width - imageEdgeInsets.left - (imageView?.frame.width ?? 0) - (titleLabel?.frame.width ?? 0)
                titleEdgeInsets = UIEdgeInsets(top: 0, left: 0, bottom: 0, right: availableWidth / 2)
                contentEdgeInsets = UIEdgeInsets(top: 0, left: 5, bottom: 0, right: 5)
            }
        }
    }
    @IBInspectable var isLeftImage: Bool = false {
        didSet {
            if isLeftImage {
                contentHorizontalAlignment = .left
                let availableSpace = UIEdgeInsetsInsetRect(bounds, contentEdgeInsets)
                let availableWidth = availableSpace.width - imageEdgeInsets.right - (imageView?.frame.width ?? 0) - (titleLabel?.frame.width ?? 0)
                titleEdgeInsets = UIEdgeInsets(top: 0, left: availableWidth / 2, bottom: 0, right: 0)
                contentEdgeInsets = UIEdgeInsets(top: 0, left: 5, bottom: 0, right: 5)
            }
        }
    }
    @IBInspectable var cornerRadius: CGFloat = 0 {
        didSet {
            layer.cornerRadius = cornerRadius
            layer.masksToBounds = true
        }
    }
    @IBInspectable var borderWidth: CGFloat = 0 {
        didSet {
            layer.borderWidth = borderWidth
            layer.masksToBounds = true
        }
    }
    @IBInspectable var borderColor: UIColor? {
        didSet {
            layer.borderColor = borderColor?.cgColor
        }
    }
    override func layoutSubviews() {
        super.layoutSubviews()
    }
}
